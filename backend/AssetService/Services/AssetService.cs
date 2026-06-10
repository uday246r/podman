using AssetManagementSystem.Api.Data;
using AssetManagementSystem.Api.DTOs;
using AssetManagementSystem.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace AssetManagementSystem.Api.Services;

public class AssetService(AppDbContext context) : IAssetService
{
    public async Task<PagedResult<AssetDto>> GetAllAsync(string? search, int page, int pageSize)
    {
        page = Math.Max(page, 1);
        pageSize = Math.Clamp(pageSize, 1, 50);

        var query = context.Assets.AsNoTracking();
        if (!string.IsNullOrWhiteSpace(search))
        {
            query = query.Where(a => EF.Functions.ILike(a.AssetName, $"%{search.Trim()}%"));
        }

        var total = await query.CountAsync();
        var items = await query
            .OrderBy(a => a.Id)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(a => ToDto(a))
            .ToListAsync();

        return new PagedResult<AssetDto>
        {
            Items = items,
            Page = page,
            PageSize = pageSize,
            TotalCount = total
        };
    }

    public async Task<AssetDto?> GetByIdAsync(int id)
    {
        return await context.Assets
            .AsNoTracking()
            .Where(a => a.Id == id)
            .Select(a => ToDto(a))
            .FirstOrDefaultAsync();
    }

    public async Task<AssetDto> CreateAsync(AssetCreateDto dto)
    {
        var asset = new Asset
        {
            AssetName = dto.AssetName.Trim(),
            Category = dto.Category.Trim(),
            Brand = dto.Brand.Trim(),
            PurchaseDate = dto.PurchaseDate,
            Status = dto.Status
        };

        context.Assets.Add(asset);
        await context.SaveChangesAsync();
        return ToDto(asset);
    }

    public async Task<AssetDto?> UpdateAsync(int id, AssetUpdateDto dto)
    {
        var asset = await context.Assets.FindAsync(id);
        if (asset is null)
        {
            return null;
        }

        asset.AssetName = dto.AssetName.Trim();
        asset.Category = dto.Category.Trim();
        asset.Brand = dto.Brand.Trim();
        asset.PurchaseDate = dto.PurchaseDate;
        asset.Status = dto.Status;

        await context.SaveChangesAsync();
        return ToDto(asset);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var asset = await context.Assets.FindAsync(id);
        if (asset is null)
        {
            return false;
        }

        var hasAssignments = await context.Assignments.AnyAsync(a => a.AssetId == id);
        if (hasAssignments)
        {
            throw new InvalidOperationException("Cannot delete an asset that has assignment history.");
        }

        context.Assets.Remove(asset);
        await context.SaveChangesAsync();
        return true;
    }

    private static AssetDto ToDto(Asset asset) =>
        new(asset.Id, asset.AssetName, asset.Category, asset.Brand, asset.PurchaseDate, asset.Status);
}
