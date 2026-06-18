using HelpdeskService.DTOs;
using HelpdeskService.Models;

namespace HelpdeskService.Services;

public interface ITicketService
{
    Task<IEnumerable<TicketDto>> GetAllAsync(
        TicketStatus? status = null,
        TicketPriority? priority = null,
        string? assignedTo = null);

    Task<TicketDto?> GetByIdAsync(Guid guid);

    Task<TicketDto> CreateAsync(CreateTicketDto createDto, string createdBy);

    Task<TicketDto?> UpdateAsync(Guid guid, UpdateTicketDto updateDto, string changedBy);

    Task<bool> DeleteAsync(Guid guid);

    Task<TicketDto?> UpdateStatusAsync(Guid guid, TicketStatus status, string changedBy);

    Task<TicketDto?> AssignAsync(Guid guid, string? assignedTo, string changedBy);

    // Advanced features
    Task<TicketCommentDto> AddCommentAsync(Guid ticketGuid, CreateCommentDto commentDto, string createdBy);

    Task<IEnumerable<TicketCommentDto>> GetCommentsAsync(Guid ticketGuid);

    Task<IEnumerable<TicketHistoryDto>> GetHistoryAsync(Guid ticketGuid);
}
