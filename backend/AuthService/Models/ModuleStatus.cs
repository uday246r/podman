namespace AuthService.Models;

public class ModuleStatus
{
    public Guid Id { get; set; }
    public string ModuleName { get; set; } = string.Empty;
    public bool IsEnabled { get; set; } = true;
    public string MaintenanceMessage { get; set; } = string.Empty;
}
