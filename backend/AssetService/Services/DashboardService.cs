using AssetManagementSystem.Api.Data;
using AssetManagementSystem.Api.DTOs;
using AssetManagementSystem.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace AssetManagementSystem.Api.Services;

public class DashboardService(AppDbContext context) : IDashboardService
{
    public async Task<DashboardDto> GetDashboardAsync()
    {
        var totalAssets = await context.Assets.CountAsync();
        var availableAssets = await context.Assets.CountAsync(a => a.Status == AssetStatus.Available);
        var assignedAssets = await context.Assets.CountAsync(a => a.Status == AssetStatus.Assigned);

        var recentAssignments = await context.Assignments
            .AsNoTracking()
            .Include(a => a.Asset)
            .Include(a => a.Employee)
            .OrderByDescending(a => a.AssignedDate)
            .ThenByDescending(a => a.Id)
            .Take(5)
            .Select(a => new AssignmentDto(
                a.Id,
                a.AssetId,
                a.Asset!.AssetName,
                a.EmployeeId,
                a.Employee!.Name,
                a.AssignedDate,
                a.ReturnedDate))
            .ToListAsync();

        return new DashboardDto(totalAssets, availableAssets, assignedAssets, recentAssignments);
    }
}
