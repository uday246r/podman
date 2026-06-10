namespace AssetManagementSystem.Api.DTOs;

public record DashboardDto(
    int TotalAssets,
    int AvailableAssets,
    int AssignedAssets,
    IReadOnlyList<AssignmentDto> RecentAssignments);
