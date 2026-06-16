using Microsoft.AspNetCore.Http;
using System.Net.Http;
using System.Text.Json;

namespace AssetManagementSystem.Api.Middleware;

public class PermissionMiddleware(RequestDelegate next, IHttpClientFactory httpClientFactory)
{
    public async Task InvokeAsync(HttpContext context)
    {
        var endpoint = context.GetEndpoint();
        if (endpoint == null)
        {
            await next(context);
            return;
        }

        // Example: Validate token and get UserId
        // In a real scenario, this would come from User.Claims after JWT authentication
        var userIdString = context.Request.Headers["X-User-Id"].FirstOrDefault() ?? "1"; // Defaulting to 1 for demo
        if (!int.TryParse(userIdString, out var userId))
        {
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            await context.Response.WriteAsync("Unauthorized");
            return;
        }

        // Call AuthService to evaluate permissions
        var client = httpClientFactory.CreateClient("AuthServiceClient");
        var response = await client.GetAsync($"/api/access/userpermissions/{userId}");

        if (response.IsSuccessStatusCode)
        {
            var content = await response.Content.ReadAsStringAsync();
            var permissions = JsonSerializer.Deserialize<List<PermissionDto>>(content, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            // Check if user has permission for 'Assets' module
            if (permissions != null && permissions.Any(p => p.ModuleName.Equals("Assets", StringComparison.OrdinalIgnoreCase) || p.ModuleName == "*"))
            {
                await next(context);
                return;
            }
        }

        context.Response.StatusCode = StatusCodes.Status403Forbidden;
        await context.Response.WriteAsync("Forbidden: You don't have permission to access the Assets module.");
    }
}

public class PermissionDto
{
    public string ModuleName { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty;
}
