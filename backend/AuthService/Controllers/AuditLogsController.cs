using Microsoft.AspNetCore.Mvc;
using AuthService.Data;
using AuthService.Models;

namespace AuthService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuditLogsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AuditLogsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> LogAction([FromBody] AuditLog log)
    {
        log.Timestamp = DateTime.UtcNow;
        _context.AuditLogs.Add(log);
        await _context.SaveChangesAsync();
        return Ok(log);
    }
}
