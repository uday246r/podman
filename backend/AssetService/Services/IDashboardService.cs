using AssetManagementSystem.Api.DTOs;

namespace AssetManagementSystem.Api.Services;

public interface IDashboardService
{
    Task<DashboardDto> GetDashboardAsync();
}
