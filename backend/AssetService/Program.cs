using AssetManagementSystem.Api.Data;
using AssetManagementSystem.Api.Services;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Controllers
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

builder.Services.AddEndpointsApiExplorer();

// PostgreSQL
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection")
    ));

// Services
builder.Services.AddScoped<IAssetService, AssetService>();
builder.Services.AddScoped<IAssignmentService, AssignmentService>();
builder.Services.AddScoped<IDashboardService, DashboardService>();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendCors", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Register HttpClient for AuthServiceClient
builder.Services.AddHttpClient("AuthServiceClient", client =>
{
    var authApiUrl = builder.Configuration["AuthApiUrl"] ?? "http://localhost:5005";
    client.BaseAddress = new Uri(authApiUrl); // Assume AuthService runs here
});

var app = builder.Build();

// Apply EF Core Migrations Automatically
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

app.UseCors("FrontendCors");

// Add Permission Middleware
app.UseMiddleware<AssetManagementSystem.Api.Middleware.PermissionMiddleware>();

app.MapControllers();

app.Run();