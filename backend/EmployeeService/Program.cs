using EmployeeService.Extensions;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen();

builder.Services.AddApplicationServices(builder.Configuration);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

using Microsoft.EntityFrameworkCore;

var app = builder.Build();

app.UseCors("AllowFrontend");

app.ConfigurePipeline();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<EmployeeService.Data.AppDbContext>();
    db.Database.Migrate();
}

app.Run();