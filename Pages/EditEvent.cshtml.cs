using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using soft20181_starter.Models;
using Microsoft.EntityFrameworkCore;

namespace soft20181_starter.Pages
{
    public class EditEventModel : PageModel
    {
        private readonly AppDatabaseContext _dbContext;

        // Inject DB context via constructor
        public EditEventModel(AppDatabaseContext dbContext)
        {
            _dbContext = dbContext;
        }

        // ✅ Retrieve ID from URL
        [BindProperty(SupportsGet = true)]
        public int Id { get; set; }

        // ✅ Event bound to the form
        [BindProperty]
        public TheEvent theEvent { get; set; } = new TheEvent();

        public IActionResult OnGet()
        {
            // ✅ Look up event in DB
            theEvent = _dbContext.TheEvent.FirstOrDefault(e => e.Id == Id) ?? new TheEvent();

            if (theEvent == null)
            {
                return NotFound();
            }

            return Page();
        }

        public IActionResult OnPost()
        {
            if (!ModelState.IsValid)
            {
                return Page();
            }

            var existingEvent = _dbContext.TheEvent.FirstOrDefault(e => e.Id == theEvent.Id);
            if (existingEvent == null)
            {
                return NotFound();
            }

            // ✅ Update each field manually or use .Update()
            existingEvent.Name = theEvent.Name;
            existingEvent.Description = theEvent.Description;
            existingEvent.Location = theEvent.Location;
            existingEvent.EventDateTime = theEvent.EventDateTime;
            existingEvent.CoverPhoto = theEvent.CoverPhoto;
            

            _dbContext.SaveChanges();

            return RedirectToPage("/Events"); // or wherever your list is
        }
    }
}