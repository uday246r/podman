using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AuthService.Data;
using AuthService.Models;

namespace AuthService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RolesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public RolesController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetRoles()
    {
        var roles = await _context.Roles
            .Include(r => r.RolePermissions)
            .Select(r => new
            {
                r.Id,
                r.Name,
                r.Description,
                RolePermissions = r.RolePermissions.Select(rp => new { rp.PermissionId }).ToList()
            })
            .ToListAsync();

        return Ok(roles);
    }

    [HttpPost]
    public async Task<IActionResult> CreateRole([FromBody] Role role)
    {
        _context.Roles.Add(role);
        await _context.SaveChangesAsync();
        return Ok(role);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateRole(Guid id, [FromBody] Role role)
    {
        if (id != role.Id) return BadRequest();
        _context.Entry(role).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return Ok(role);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteRole(Guid id)
    {
        var role = await _context.Roles.FindAsync(id);
        if (role == null) return NotFound();
        _context.Roles.Remove(role);
        await _context.SaveChangesAsync();
        return Ok();
    }

    [HttpPut("{id}/permissions")]
    public async Task<IActionResult> UpdateRolePermissions(Guid id, [FromBody] List<Guid> permissionIds)
    {
        var role = await _context.Roles
            .Include(r => r.RolePermissions)
            .FirstOrDefaultAsync(r => r.Id == id);
            
        if (role == null) return NotFound();

        _context.RolePermissions.RemoveRange(role.RolePermissions);
        
        foreach(var permId in permissionIds)
        {
            role.RolePermissions.Add(new RolePermission { RoleId = id, PermissionId = permId });
        }
        
        await _context.SaveChangesAsync();
        return Ok();
    }
}
