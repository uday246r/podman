using AssetManagementSystem.Api.DTOs;

namespace AssetManagementSystem.Api.Services;

public interface IAssignmentService
{
    Task<IReadOnlyList<AssignmentDto>> GetAllAsync();
    Task<AssignmentDto?> GetByIdAsync(int id);
    Task<(AssignmentDto? Assignment, string? Error)> AssignAsync(AssignmentCreateDto dto);
    Task<(bool Success, string? Error)> ReturnAsync(int id);
}
