using AssetManagementSystem.Api.DTOs;

namespace AssetManagementSystem.Api.Services;

public interface IAssetService
{
    Task<PagedResult<AssetDto>> GetAllAsync(string? search, int page, int pageSize);
    Task<AssetDto?> GetByIdAsync(int id);
    Task<AssetDto> CreateAsync(AssetCreateDto dto);
    Task<AssetDto?> UpdateAsync(int id, AssetUpdateDto dto);
    Task<bool> DeleteAsync(int id);
}
