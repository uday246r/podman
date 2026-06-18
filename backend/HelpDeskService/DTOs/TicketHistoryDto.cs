namespace HelpdeskService.DTOs;

public class TicketHistoryDto
{
    public Guid Guid { get; set; }

    public Guid TicketGuid { get; set; }

    public string FieldName { get; set; } = string.Empty;

    public string OldValue { get; set; } = string.Empty;

    public string NewValue { get; set; } = string.Empty;

    public string ChangedBy { get; set; } = string.Empty;

    public DateTime ChangedAt { get; set; }
}
