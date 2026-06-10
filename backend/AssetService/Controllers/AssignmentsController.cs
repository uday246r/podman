using AssetManagementSystem.Api.DTOs;
using AssetManagementSystem.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace AssetManagementSystem.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AssignmentsController(IAssignmentService service) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<AssignmentDto>>> GetAssignments()
    {
        return Ok(await service.GetAllAsync());
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<AssignmentDto>> GetAssignment(int id)
    {
        var assignment = await service.GetByIdAsync(id);
        return assignment is null ? NotFound() : Ok(assignment);
    }

    [HttpPost]
    public async Task<ActionResult<AssignmentDto>> AssignAsset(AssignmentCreateDto dto)
    {
        var (assignment, error) = await service.AssignAsync(dto);
        if (assignment is null)
        {
            return BadRequest(new { message = error });
        }

        return CreatedAtAction(nameof(GetAssignment), new { id = assignment.Id }, assignment);
    }

    [HttpPost("{id:int}/return")]
    public async Task<IActionResult> ReturnAsset(int id)
    {
        var (success, error) = await service.ReturnAsync(id);
        if (!success)
        {
            return BadRequest(new { message = error });
        }

        return NoContent();
    }
}
