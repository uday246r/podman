using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AuthService.Data;

namespace AuthService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AccessController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AccessController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("UserPermissions/{userId}")]
    public async Task<IActionResult> GetUserPermissions(Guid userId)
    {
        var roleIds = await _context.UserRoles
            .Where(ur => ur.UserId == userId)
            .Select(ur => ur.RoleId)
            .ToListAsync();

        var permissions = await _context.RolePermissions
            .Where(rp => roleIds.Contains(rp.RoleId))
            .Select(rp => rp.Permission)
            .Distinct()
            .ToListAsync();

        return Ok(permissions);
    }

    [HttpGet("UserRoleName/{userId}")]
    public async Task<IActionResult> GetUserRoleName(Guid userId)
    {
        var roleName = await _context.UserRoles
            .Where(ur => ur.UserId == userId)
            .Select(ur => ur.Role.Name)
            .FirstOrDefaultAsync();

        return Ok(new { roleName = roleName ?? "admin" });
    }

    [HttpGet("CheckPermission")]
    public async Task<IActionResult> CheckPermission([FromQuery] Guid userId, [FromQuery] string moduleName, [FromQuery] string action)
    {
        var roleIds = await _context.UserRoles
            .Where(ur => ur.UserId == userId)
            .Select(ur => ur.RoleId)
            .ToListAsync();

        var hasPermission = await _context.RolePermissions
            .Where(rp => roleIds.Contains(rp.RoleId))
            .AnyAsync(rp => 
                (rp.Permission.ModuleName.ToLower() == moduleName.ToLower() || rp.Permission.ModuleName == "*") &&
                (rp.Permission.Action.ToLower() == action.ToLower() || rp.Permission.Action == "*"));

        return Ok(new { hasPermission });
    }
}
