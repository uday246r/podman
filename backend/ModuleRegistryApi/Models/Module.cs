namespace ModuleRegistryApi.Models;

public class Module
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public string Name { get; set; } = string.Empty;

    public string Route { get; set; } = string.Empty;

    public string RemoteUrl { get; set; } = string.Empty;

    public string ExposedModule { get; set; } = string.Empty;

    public bool Enabled { get; set; } = true;
}