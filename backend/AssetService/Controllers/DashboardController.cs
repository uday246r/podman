using AssetManagementSystem.Api.DTOs;
using AssetManagementSystem.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace AssetManagementSystem.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DashboardController(IDashboardService service) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<DashboardDto>> GetDashboard()
    {
        return Ok(await service.GetDashboardAsync());
    }
}
