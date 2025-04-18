using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using soft20181_starter.Models;

var builder = WebApplication.CreateBuilder(args);

// 🔐 Connection string
var connectionString = builder.Configuration.GetConnectionString("AppDatabaseContextConnection")
                       ?? throw new InvalidOperationException("Connection string 'AppDatabaseContextConnection' not found.");

// 🔌 Register database context
builder.Services.AddDbContext<AppDatabaseContext>(options =>
    options.UseSqlite(connectionString));

// 🔐 Register Identity (only ONCE, clean and correct)
builder.Services.AddIdentity<AppUser, IdentityRole>(options =>
    {
        options.SignIn.RequireConfirmedAccount = false;
    })
    .AddEntityFrameworkStores<AppDatabaseContext>()
    .AddDefaultTokenProviders()
    .AddDefaultUI();

// 🧠 Add Razor Pages
builder.Services.AddRazorPages();

var app = builder.Build();

// 🌐 Middleware pipeline
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthentication(); // 🔐 Auth middleware
app.UseAuthorization();

app.MapRazorPages();

app.Run();