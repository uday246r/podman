using Microsoft.EntityFrameworkCore;
using ModuleRegistryApi.Data;
using ModuleRegistryApi.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<ApplicationDbContext>(
    options =>
        options.UseNpgsql(
            builder.Configuration.GetConnectionString(
                "DefaultConnection"
            )
        )
);

builder.Services.AddCors(options =>
{
    options.AddPolicy(
        "AllowAll",
        policy =>
        {
            policy
                .AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader();
        }
    );
});

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("AllowAll");


// GET ALL ENABLED MODULES
app.MapGet(
    "/api/modules",
    async (ApplicationDbContext db) =>
    {
        return await db.Modules
            .Where(x => x.Enabled)
            .ToListAsync();
    }
);


// GET MODULE BY ID
app.MapGet(
    "/api/modules/{id:guid}",
    async (
        Guid id,
        ApplicationDbContext db
    ) =>
    {
        var module =
            await db.Modules.FindAsync(id);

        return module is null
            ? Results.NotFound()
            : Results.Ok(module);
    }
);


// CREATE MODULE
app.MapPost(
    "/api/modules",
    async (
        Module module,
        ApplicationDbContext db
    ) =>
    {
        db.Modules.Add(module);

        await db.SaveChangesAsync();

        return Results.Created(
            $"/api/modules/{module.Id}",
            module
        );
    }
);


// UPDATE MODULE
app.MapPut(
    "/api/modules/{id:guid}",
    async (
        Guid id,
        Module updatedModule,
        ApplicationDbContext db
    ) =>
    {
        var existingModule =
            await db.Modules.FindAsync(id);

        if (existingModule is null)
            return Results.NotFound();

        existingModule.Name =
            updatedModule.Name;

        existingModule.Route =
            updatedModule.Route;

        existingModule.RemoteUrl =
            updatedModule.RemoteUrl;

        existingModule.Enabled =
            updatedModule.Enabled;

        await db.SaveChangesAsync();

        return Results.Ok(existingModule);
    }
);


// ENABLE / DISABLE MODULE
app.MapPatch(
    "/api/modules/{id:guid}/status",
    async (
        Guid id,
        bool enabled,
        ApplicationDbContext db
    ) =>
    {
        var module =
            await db.Modules.FindAsync(id);

        if (module is null)
            return Results.NotFound();

        module.Enabled = enabled;

        await db.SaveChangesAsync();

        return Results.Ok(module);
    }
);


// DELETE MODULE
app.MapDelete(
    "/api/modules/{id:guid}",
    async (
        Guid id,
        ApplicationDbContext db
    ) =>
    {
        var module =
            await db.Modules.FindAsync(id);

        if (module is null)
            return Results.NotFound();

        db.Modules.Remove(module);

        await db.SaveChangesAsync();

        return Results.NoContent();
    }
);

app.Run();