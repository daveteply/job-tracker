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
    public static record PullRequest(String collection, Checkpoint checkpoint, int limit) {}
    public static record PullResponse(List<JsonNode> documents, Checkpoint checkpoint) {}
    public static record PushRow(JsonNode newDocumentState, JsonNode assumedMasterState) {}

    @POST
    @Path("/pull")
    public PullResponse pull(PullRequest request, @HeaderParam("X-User-Id") String userId) {
        if (userId == null) throw new BadRequestException("X-User-Id header is required");
        if (request.collection() == null) throw new BadRequestException("collection is required");

        long lastTimestamp = request.checkpoint() != null ? request.checkpoint().serverTimestamp() : 0;
        
        // Find events for this user and collection that happened AFTER the last checkpoint
        List<SyncEvent> events = SyncEvent.find("userId = ?1 and collectionName = ?2 and serverTimestamp >= ?3", 
                                  Sort.by("serverTimestamp").and("id"), 
                                  userId, request.collection(), lastTimestamp)
                                  .page(0, request.limit() > 0 ? request.limit() : 100)
                                  .list();

        List<JsonNode> documents = new java.util.ArrayList<>();
        Checkpoint nextCheckpoint = null;
        if (!events.isEmpty()) {
            for (SyncEvent event : events) {
                documents.add(event.payload);
            }
            SyncEvent last = events.get(events.size() - 1);
            nextCheckpoint = new Checkpoint(last.serverTimestamp, last.id.toString());
        }

        return new PullResponse(documents, nextCheckpoint);
    }

    @POST
    @Path("/push")
    @Transactional
    public List<Map<String, Object>> push(List<PushRow> rows, @HeaderParam("X-User-Id") String userId, @QueryParam("collection") String collectionName) {
        if (userId == null) throw new BadRequestException("X-User-Id header is required");
        if (collectionName == null) throw new BadRequestException("collection query param is required");

        for (PushRow row : rows) {
            SyncEvent event = new SyncEvent();
            event.userId = userId;
            event.collectionName = collectionName;
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
