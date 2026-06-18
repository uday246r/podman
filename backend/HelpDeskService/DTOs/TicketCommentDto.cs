namespace HelpdeskService.DTOs;

public class TicketCommentDto
{
    public Guid Guid { get; set; }

    public Guid TicketGuid { get; set; }

    public string CommentText { get; set; } = string.Empty;

    public string CreatedBy { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }
}
