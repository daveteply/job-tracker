package com.jobtracker.sync;

import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import java.util.List;
import java.util.Map;
import io.quarkus.panache.common.Sort;
import com.fasterxml.jackson.databind.JsonNode;

@Path("/sync")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class SyncResource {

    public static record Checkpoint(long serverTimestamp, String id) {}
    public static record PullRequest(Checkpoint checkpoint, int limit) {}
    public static record PullResponse(List<SyncEvent> documents, Checkpoint checkpoint) {}
    public static record PushRow(JsonNode newDocumentState, JsonNode assumedMasterState) {}

    @POST
    @Path("/pull")
    public PullResponse pull(PullRequest request, @HeaderParam("X-User-Id") String userId) {
        if (userId == null) throw new BadRequestException("X-User-Id header is required");

        long lastTimestamp = request.checkpoint() != null ? request.checkpoint().serverTimestamp() : 0;
        
        // Find events for this user that happened AFTER the last checkpoint
        List<SyncEvent> events = SyncEvent.find("userId = ?1 and serverTimestamp >= ?2", 
                                  Sort.by("serverTimestamp").and("id"), 
                                  userId, lastTimestamp)
                                  .page(0, request.limit() > 0 ? request.limit() : 100)
                                  .list();

        Checkpoint nextCheckpoint = null;
        if (!events.isEmpty()) {
            SyncEvent last = events.get(events.size() - 1);
            nextCheckpoint = new Checkpoint(last.serverTimestamp, last.id.toString());
        }

        return new PullResponse(events, nextCheckpoint);
    }

    @POST
    @Path("/push")
    @Transactional
    public List<Map<String, Object>> push(List<PushRow> rows, @HeaderParam("X-User-Id") String userId) {
        if (userId == null) throw new BadRequestException("X-User-Id header is required");

        for (PushRow row : rows) {
            SyncEvent event = new SyncEvent();
            event.userId = userId;
            event.documentId = row.newDocumentState().get("id").asText();
            event.payload = row.newDocumentState();
            event.eventOp = "UPSERT"; // Simplification for now
            event.version = row.newDocumentState().has("version") ? row.newDocumentState().get("version").asInt() : 1;
            event.serverTimestamp = System.currentTimeMillis();
            event.persist();
        }
        
        // Return conflicts (empty for now as we're following "Client is Master" for MVP)
        return List.of();
    }
}
