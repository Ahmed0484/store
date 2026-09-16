using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class StoreContext(DbContextOptions options) : IdentityDbContext<User>(options)
    {
        public DbSet<Product> Products { get; set; }
        public DbSet<Basket> Baskets { get; set; }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<IdentityRole>()
                .HasData(
                    new IdentityRole
                    {
                        Id = "e069461a-10cf-4abf-9930-d070b2a7e40f",
                        Name = "Member",
                        NormalizedName = "MEMBER",
                        ConcurrencyStamp = "Member"
                    },
                    new IdentityRole
                    {
                        Id = "ed2e9149-fa53-484c-a93f-bd33f9e9fcf6",
                        Name = "Admin",
                        NormalizedName = "ADMIN",
                        ConcurrencyStamp = "Admin"
                    }
                );
        }
    }
}