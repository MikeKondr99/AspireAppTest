using Keycloak.AuthServices.Authentication;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using System.Diagnostics;



var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;

// Add service defaults & Aspire client integrations.
builder.AddServiceDefaults();

builder.AddNpgsqlDbContext<ApplicationDbContext>("app-postgres-db");

// Add services to the container.
builder.Services.AddProblemDetails();

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddCors();

builder.Services.AddKeycloakWebApiAuthentication(
    configuration,
    options =>
    {
        options.Audience = "workspaces-client";
        options.RequireHttpsMetadata = false;
    }
);

builder.Services.AddAuthorization();

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseExceptionHandler();

if (app.Environment.IsDevelopment())
{
    app.MapScalarApiReference(options =>
    {
        options.ProxyUrl = $"https://localhost:{Environment.GetEnvironmentVariable("ASPNETCORE_HTTPS_PORT")}";
    });
    app.MapOpenApi();
}

app.UseCors(static builder =>
    builder.AllowAnyMethod()
        .AllowAnyHeader()
        .AllowAnyOrigin());




app.UseAuthentication();

app.UseAuthorization();



app.MapDefaultEndpoints();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    db.Database.EnsureCreated();
    db.Database.Migrate();

}

app.MapGet("/", (ActivitySource source, ApplicationDbContext db) =>
{
    using (var activity = source.StartActivity("Query all Products and add one"))
    {
        var products = db.Products.ToArray();
        activity?.SetTag("Count", products.Length);

        var id = (products.MaxBy(p => p.Id)?.Id ?? 0) + 1;

        db.Products.Add(new Product()
        {
            Id = id,
            Name = $"Name{id}",
            Price = id * 10,
        });
        db.SaveChanges();
        return products;
    }
})
.WithName("GetWeatherForecast");

app.MapGet("/secure", () =>
{
    return "secure";
})
.RequireAuthorization();

app.MapGet("/otel", () =>
{
    string[] response = [Environment.GetEnvironmentVariable("OTEL_EXPORTER_OTLP_ENDPOINT"), Environment.GetEnvironmentVariable("OTEL_EXPORTER_OTLP_HEADERS")];
    return response;
});

app.Run();
