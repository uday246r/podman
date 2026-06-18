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

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdatePermission(Guid id, [FromBody] Permission permission)
    {
        if (id != permission.Id) return BadRequest();
        _context.Entry(permission).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return Ok(permission);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePermission(Guid id)
    {
        var perm = await _context.Permissions.FindAsync(id);
        if (perm == null) return NotFound();
        _context.Permissions.Remove(perm);
        await _context.SaveChangesAsync();
        return Ok();
    }

    [HttpPost("Toggle")]
    public async Task<IActionResult> TogglePermission([FromBody] ToggleRequest req)
    {
        var rp = await _context.RolePermissions
            .FirstOrDefaultAsync(x => x.RoleId == req.RoleId && x.PermissionId == req.PermissionId);

        if (req.IsAssigned)
        {
            if (rp == null)
            {
                _context.RolePermissions.Add(new RolePermission { RoleId = req.RoleId, PermissionId = req.PermissionId });
            }
        }
        else
        {
            if (rp != null)
            {
                _context.RolePermissions.Remove(rp);
            }
        }

        await _context.SaveChangesAsync();
        return Ok();
    }
}

public class ToggleRequest
{
    public Guid RoleId { get; set; }
    public Guid PermissionId { get; set; }
    public bool IsAssigned { get; set; }
}
