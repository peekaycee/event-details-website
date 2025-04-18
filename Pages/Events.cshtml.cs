using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.RazorPages;
using soft20181_starter.Models;

namespace soft20181_starter.Pages
{
    [Authorize]
    public class EventModel : PageModel
    {
        private readonly AppDatabaseContext _dbContext;

        public EventModel(AppDatabaseContext dbContext)
        {
            _dbContext = dbContext;
        }

        // Public property for Razor page to use
        public List<TheEvent> Events { get; set; } = new List<TheEvent>();

        public void OnGet()
        {
            // Load from your JSON-backed database property
            Events = _dbContext.TheEvent.ToList();
        }
    }
}