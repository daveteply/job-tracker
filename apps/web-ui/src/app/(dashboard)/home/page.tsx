'use client';

// Purpose: Daily command center
// "What do I need to do today?"

export default function HomePage() {
  return (
    <div>
      <h2>Reminders</h2>
      <div className="card bg-base-300 shadow-sm">
        <div className="card-body">
          <h2 className="card-title">Follow up with John</h2>
          <p>Card data</p>
        </div>
      </div>

      <h2>Recent Activity</h2>
      {/* This is just Events sorted by occurredAt. */}
      <div className="card bg-base-300 shadow-sm">
        <div className="card-body">
          <h2 className="card-title">⬅️ Recruiter Outreach</h2>
          <p>Card data</p>
        </div>
      </div>

      <h2>Active Roles</h2>
      {/* Tap → role details. */}
      <div className="card bg-base-300 shadow-sm">
        <div className="card-body">
          <h2 className="card-title">Walmart - Janitor</h2>
          <p>Card data</p>
        </div>
      </div>
    </div>
  );
}
