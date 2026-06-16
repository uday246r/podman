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
        .Select(r => new
        {
            r.Id,
            r.Name
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
    public async Task<IActionResult> UpdateRole(int id, [FromBody] Role role)
    {
        if (id != role.Id) return BadRequest();
        _context.Entry(role).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return Ok(role);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteRole(int id)
    {
        var role = await _context.Roles.FindAsync(id);
        if (role == null) return NotFound();
        _context.Roles.Remove(role);
        await _context.SaveChangesAsync();
        return Ok();
    }
}
