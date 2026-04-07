package com.jobtracker.sync;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import java.util.UUID;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import com.fasterxml.jackson.databind.JsonNode;

@Entity
@Table(name = "sync_events")
public class SyncEvent extends PanacheEntityBase {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    public UUID id;

    @Column(name = "user_id", nullable = false)
    public String userId;

    @Column(name = "event_op", nullable = false)
    public String eventOp;

    @Column(name = "document_id", nullable = false)
    public String documentId;

    @Column(name = "collection_name", nullable = false)
    public String collectionName;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "payload", nullable = false)
    public JsonNode payload;

    @Column(name = "version", nullable = false)
    public int version;

    @Column(name = "server_timestamp")
    public long serverTimestamp = System.currentTimeMillis();
}
