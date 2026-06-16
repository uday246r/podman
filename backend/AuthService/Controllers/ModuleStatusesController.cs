using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AuthService.Data;
using AuthService.Models;

namespace AuthService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ModuleStatusesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ModuleStatusesController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetStatuses()
    {
        var statuses = await _context.ModuleStatuses.ToListAsync();
        return Ok(statuses);
    }

    [HttpPut("{moduleName}")]
    public async Task<IActionResult> UpdateStatus(string moduleName, [FromBody] ModuleStatus status)
    {
        var existing = await _context.ModuleStatuses.FirstOrDefaultAsync(m => m.ModuleName == moduleName);
        if (existing == null)
        {
            _context.ModuleStatuses.Add(new ModuleStatus
            {
                ModuleName = moduleName,
                IsEnabled = status.IsEnabled,
                MaintenanceMessage = status.MaintenanceMessage
            });
        }
        else
        {
            existing.IsEnabled = status.IsEnabled;
            existing.MaintenanceMessage = status.MaintenanceMessage;
        }
        await _context.SaveChangesAsync();
        return Ok();
    }
}
