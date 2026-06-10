using AssetManagementSystem.Api.Data;
using AssetManagementSystem.Api.DTOs;
using AssetManagementSystem.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace AssetManagementSystem.Api.Services;

public class AssignmentService(AppDbContext context) : IAssignmentService
{
    public async Task<IReadOnlyList<AssignmentDto>> GetAllAsync()
    {
        return await context.Assignments
            .AsNoTracking()
            .Include(a => a.Asset)
            .Include(a => a.Employee)
            .OrderByDescending(a => a.AssignedDate)
            .ThenByDescending(a => a.Id)
            .Select(a => ToDto(a))
            .ToListAsync();
    }

    public async Task<AssignmentDto?> GetByIdAsync(int id)
    {
        return await context.Assignments
            .AsNoTracking()
            .Include(a => a.Asset)
            .Include(a => a.Employee)
            .Where(a => a.Id == id)
            .Select(a => ToDto(a))
            .FirstOrDefaultAsync();
    }

    public async Task<(AssignmentDto? Assignment, string? Error)> AssignAsync(AssignmentCreateDto dto)
    {
        var asset = await context.Assets.FindAsync(dto.AssetId);
        if (asset is null)
        {
            return (null, "Asset not found.");
        }

        var employeeExists = await context.Employees.AnyAsync(e => e.Id == dto.EmployeeId);
        if (!employeeExists)
        {
            return (null, "Employee not found.");
        }

        var hasActiveAssignment = await context.Assignments
            .AnyAsync(a => a.AssetId == dto.AssetId && a.ReturnedDate == null);

        if (hasActiveAssignment || asset.Status == AssetStatus.Assigned)
        {
            return (null, "This asset is already assigned.");
        }

        var assignment = new Assignment
        {
            AssetId = dto.AssetId,
            EmployeeId = dto.EmployeeId,
            AssignedDate = dto.AssignedDate
        };

        asset.Status = AssetStatus.Assigned;
        context.Assignments.Add(assignment);
        await context.SaveChangesAsync();

        return (await GetByIdAsync(assignment.Id), null);
    }

    public async Task<(bool Success, string? Error)> ReturnAsync(int id)
    {
        var assignment = await context.Assignments
            .Include(a => a.Asset)
            .FirstOrDefaultAsync(a => a.Id == id);

        if (assignment is null)
        {
            return (false, "Assignment not found.");
        }

        if (assignment.ReturnedDate is not null)
        {
            return (false, "This assignment has already been returned.");
        }

        assignment.ReturnedDate = DateOnly.FromDateTime(DateTime.Today);
        if (assignment.Asset is not null)
        {
            assignment.Asset.Status = AssetStatus.Available;
        }

        await context.SaveChangesAsync();
        return (true, null);
    }

    private static AssignmentDto ToDto(Assignment assignment) =>
        new(
            assignment.Id,
            assignment.AssetId,
            assignment.Asset?.AssetName ?? string.Empty,
            assignment.EmployeeId,
            assignment.Employee?.Name ?? string.Empty,
            assignment.AssignedDate,
            assignment.ReturnedDate);
}
