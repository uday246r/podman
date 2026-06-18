using HelpdeskService.DTOs;
using HelpdeskService.Models;
using HelpdeskService.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Mvc;

namespace HelpdeskService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TicketController : ControllerBase
{
    private readonly ITicketService _ticketService;
    private readonly IConfiguration _configuration;

    public TicketController(ITicketService ticketService, IConfiguration configuration)
    {
        _ticketService = ticketService;
        _configuration = configuration;
    }

    [HttpGet]
    public async Task<IActionResult> GetTickets(
        [FromQuery] TicketStatus? status,
        [FromQuery] TicketPriority? priority,
        [FromQuery] string? assignedTo)
    {
        if (!await HasPermissionAsync("view_ticket")) return StatusCode(403, "Forbidden: Missing view_ticket permission");

        var tickets = await _ticketService.GetAllAsync(status, priority, assignedTo);
        return Ok(tickets);
    }

    [HttpGet("{guid}")]
    public async Task<IActionResult> GetTicket(Guid guid)
    {
        if (!await HasPermissionAsync("view_ticket")) return StatusCode(403, "Forbidden: Missing view_ticket permission");

        var ticket = await _ticketService.GetByIdAsync(guid);
        return Ok(ticket);
    }

    [HttpPost]
    public async Task<IActionResult> CreateTicket(CreateTicketDto createDto)
    {
        if (!await HasPermissionAsync("create_ticket")) return StatusCode(403, "Forbidden: Missing create_ticket permission");

        var username = User.Identity?.Name ?? "Anonymous";
        var ticket = await _ticketService.CreateAsync(createDto, username);

        return CreatedAtAction(
            nameof(GetTicket),
            new { guid = ticket.Guid },
            ticket);
    }

    [HttpPut("{guid}")]
    public async Task<IActionResult> UpdateTicket(Guid guid, UpdateTicketDto updateDto)
    {
        if (!await HasPermissionAsync("edit_ticket")) return StatusCode(403, "Forbidden: Missing edit_ticket permission");

        var username = User.Identity?.Name ?? "Anonymous";
        var ticket = await _ticketService.UpdateAsync(guid, updateDto, username);
        return Ok(ticket);
    }

    [HttpDelete("{guid}")]
    public async Task<IActionResult> DeleteTicket(Guid guid)
    {
        if (!await HasPermissionAsync("delete_ticket")) return StatusCode(403, "Forbidden: Missing delete_ticket permission");

        await _ticketService.DeleteAsync(guid);
        return NoContent();
    }

    [HttpPatch("{guid}/status")]
    public async Task<IActionResult> UpdateStatus(Guid guid, [FromBody] UpdateStatusDto statusDto)
    {
        if (!await HasPermissionAsync("update_ticket_status")) return StatusCode(403, "Forbidden: Missing update_ticket_status permission");

        var username = User.Identity?.Name ?? "Anonymous";
        var ticket = await _ticketService.UpdateStatusAsync(guid, statusDto.Status, username);
        return Ok(ticket);
    }

    [HttpPatch("{guid}/assign")]
    public async Task<IActionResult> Assign(Guid guid, [FromBody] AssignTicketDto assignDto)
    {
        if (!await HasPermissionAsync("assign_ticket")) return StatusCode(403, "Forbidden: Missing assign_ticket permission");

        var username = User.Identity?.Name ?? "Anonymous";
        var ticket = await _ticketService.AssignAsync(guid, assignDto.AssignedTo, username);
        return Ok(ticket);
    }

    // Advanced Helpdesk Features Endpoints
    [HttpPost("{guid}/comments")]
    public async Task<IActionResult> AddComment(Guid guid, [FromBody] CreateCommentDto commentDto)
    {
        if (!await HasPermissionAsync("add_ticket_comment")) return StatusCode(403, "Forbidden: Missing add_ticket_comment permission");

        var username = User.Identity?.Name ?? "Anonymous";
        var comment = await _ticketService.AddCommentAsync(guid, commentDto, username);
        return Ok(comment);
    }

    [HttpGet("{guid}/comments")]
    public async Task<IActionResult> GetComments(Guid guid)
    {
        if (!await HasPermissionAsync("view_ticket")) return StatusCode(403, "Forbidden: Missing view_ticket permission");

        var comments = await _ticketService.GetCommentsAsync(guid);
        return Ok(comments);
    }

    [HttpGet("{guid}/history")]
    public async Task<IActionResult> GetHistory(Guid guid)
    {
        if (!await HasPermissionAsync("view_ticket")) return StatusCode(403, "Forbidden: Missing view_ticket permission");

        var history = await _ticketService.GetHistoryAsync(guid);
        return Ok(history);
    }

    private async Task<bool> HasPermissionAsync(string requiredAction)
    {
        var authHeader = Request.Headers["Authorization"].FirstOrDefault();
        if (string.IsNullOrEmpty(authHeader)) return false;

        var authApiUrl = _configuration["AuthApiUrl"] ?? "http://localhost:5005";

        using var client = new HttpClient();
        client.DefaultRequestHeaders.Add("Authorization", authHeader);
        
        var meRes = await client.GetAsync($"{authApiUrl}/api/auth/me");
        if (!meRes.IsSuccessStatusCode) return false;
        
        var meContent = await meRes.Content.ReadAsStringAsync();
        var user = System.Text.Json.JsonDocument.Parse(meContent).RootElement;
        if (!user.TryGetProperty("id", out var idProp)) return false;
        var userId = idProp.GetString();

        var permRes = await client.GetAsync($"{authApiUrl}/api/access/userpermissions/{userId}");
        if (!permRes.IsSuccessStatusCode) return false;

        var permContent = await permRes.Content.ReadAsStringAsync();
        var perms = System.Text.Json.JsonDocument.Parse(permContent).RootElement;

        foreach (var p in perms.EnumerateArray())
        {
            var modName = p.GetProperty("moduleName").GetString()?.ToLower();
            var action = p.GetProperty("action").GetString()?.ToLower();
            
            if ((modName == "helpdeskmodule" || modName == "*") && 
                (action == requiredAction.ToLower() || action == "*"))
            {
                return true;
            }
        }
        return false;
    }
}
