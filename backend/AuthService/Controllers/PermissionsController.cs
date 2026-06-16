using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AuthService.Data;
using AuthService.Models;

namespace AuthService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PermissionsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public PermissionsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetPermissions()
    {
        var permissions = await _context.Permissions.ToListAsync();
        return Ok(permissions);
    }

    [HttpPost]
    public async Task<IActionResult> CreatePermission([FromBody] Permission permission)
    {
        _context.Permissions.Add(permission);
        await _context.SaveChangesAsync();
        return Ok(permission);
    }

    [HttpPost("Assign")]
    public async Task<IActionResult> AssignPermission([FromBody] RolePermission rp)
    {
        _context.RolePermissions.Add(rp);
        await _context.SaveChangesAsync();
        return Ok();
    }
}
