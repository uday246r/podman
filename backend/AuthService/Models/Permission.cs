namespace AuthService.Models;

public class Permission
{
    public int Id { get; set; }
    public string ModuleName { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty; // View, Create, Update, Delete

    public ICollection<RolePermission> RolePermissions { get; set; } = new List<RolePermission>();
}
