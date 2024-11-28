


var builder = DistributedApplication
    .CreateBuilder(args);

var keycloak = builder
    .AddKeycloakContainer("app-keycloak")
    .WithDataVolume()
    .WithLifetime(ContainerLifetime.Persistent)
    .WithImport("./KeycloakConfiguration/Test-realm.json")
    .WithImport("./KeycloakConfiguration/Test-users-0.json")
    .WithHttpHealthCheck();

var realm = keycloak.AddRealm("Test");

var postgres = builder
    .AddPostgres("app-postgres")
    .WithDataVolume();

var db = postgres
    .AddDatabase("app-postgres-db");

var api = builder
    .AddProject<Projects.App_ApiService>("app-api")
    .WithReference(realm)
    .WithReference(db)
    .WaitFor(db)
    .WaitFor(realm);

builder.AddNpmApp("app-angular", "../App.Angular")
    .WithReference(api)
    .WithReference(realm)
    .WaitFor(api)
    .WithHttpEndpoint(env: "PORT")
    .WithHttpHealthCheck()
    .WithExternalHttpEndpoints()
    .PublishAsDockerFile();

builder.Build().Run();
