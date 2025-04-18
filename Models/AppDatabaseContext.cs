using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace soft20181_starter.Models
{
    public class AppDatabaseContext : IdentityDbContext
    {
        public AppDatabaseContext(DbContextOptions<AppDatabaseContext> options) : base(options)
        { }
        
        public DbSet<ContactForm> ContactForms { get; set; }
        public DbSet<TheEvent> TheEvent { get; set; }
    }
        // public DbSet<Contact> Contacts { get; set; }
    }


