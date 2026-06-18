namespace AuthService.Models;

public class AuditLog
{
    public Guid Id { get; set; } 
    public Guid UserId { get; set; }
    public string Action { get; set; } = string.Empty;
    public string Details { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}
