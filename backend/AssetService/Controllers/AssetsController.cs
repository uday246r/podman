using AssetManagementSystem.Api.DTOs;
using AssetManagementSystem.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace AssetManagementSystem.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AssetsController(IAssetService service) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<PagedResult<AssetDto>>> GetAssets(
        [FromQuery] string? search,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        return Ok(await service.GetAllAsync(search, page, pageSize));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<AssetDto>> GetAsset(int id)
    {
        var asset = await service.GetByIdAsync(id);
        return asset is null ? NotFound() : Ok(asset);
    }

    [HttpPost]
    public async Task<ActionResult<AssetDto>> CreateAsset(AssetCreateDto dto)
    {
        var asset = await service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetAsset), new { id = asset.Id }, asset);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<AssetDto>> UpdateAsset(int id, AssetUpdateDto dto)
    {
        var asset = await service.UpdateAsync(id, dto);
        return asset is null ? NotFound() : Ok(asset);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteAsset(int id)
    {
        try
        {
            var deleted = await service.DeleteAsync(id);
            return deleted ? NoContent() : NotFound();
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }
}
