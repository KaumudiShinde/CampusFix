export function exportIssuesToCSV(issues) {
  if (!issues || issues.length === 0) {
    alert('No facility issues available to export.');
    return;
  }

  const headers = [
    'Ticket ID',
    'Title',
    'Building',
    'Room',
    'Category',
    'Priority',
    'Status',
    'Reported By',
    'Assigned Technician',
    'Created At'
  ];

  const rows = issues.map(issue => [
    issue.ticket_id || '',
    issue.title || '',
    issue.building_name || '',
    issue.room_number || '',
    issue.category_display || issue.category || '',
    issue.priority_display || issue.priority || '',
    issue.status_display || issue.status || '',
    issue.reported_by_name || '',
    issue.assigned_technician || 'Not Assigned',
    issue.created_at
      ? new Date(issue.created_at).toLocaleString()
      : ''
  ]);

  const csv = [
    headers,
    ...rows
  ]
    .map(row =>
      row.map(value =>
        '"' + String(value).replace(/"/g, '""') + '"'
      ).join(',')
    )
    .join('\n');

  const blob = new Blob([csv], {
    type: 'text/csv;charset=utf-8;'
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = 'campus-facility-issues.csv';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}