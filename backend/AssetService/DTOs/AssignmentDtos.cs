using System.ComponentModel.DataAnnotations;

namespace AssetManagementSystem.Api.DTOs;

public record AssignmentDto(
    int Id,
    int AssetId,
    string AssetName,
    Guid EmployeeId,
    string EmployeeName,
    DateOnly AssignedDate,
    DateOnly? ReturnedDate);

public class AssignmentCreateDto
{
    [Required]
    public int AssetId { get; set; }

    [Required]
    public Guid EmployeeId { get; set; }

    [Required]
    public DateOnly AssignedDate { get; set; } = DateOnly.FromDateTime(DateTime.Today);
}
