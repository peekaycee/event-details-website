using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using soft20181_starter.Models; // Make sure ContactForm is in this namespace

namespace soft20181_starter.Pages
{
    public class ContactModel : PageModel
    {
        public ContactModel(ContactForm contactForm)
        {
            ContactForm = contactForm;
        }

        // ✅ Fix 1: Updated class name from `Contact` to `ContactForm` to match your model file
        [BindProperty]
        public ContactForm ContactForm { get; set; }

        public void OnGet()
        {
            // ✅ Optional: Initialize the form to avoid null issues in the view
            ContactForm = new ContactForm();
        }

        public IActionResult OnPost()
        {
            // ✅ Check model validity
            if (ModelState.IsValid)
            {
                // ✅ TODO: Save ContactForm to the database if needed

                // ✅ Set TempData for success message (optional)
                TempData["Message"] = "Thank you for reaching out! We'll get back to you shortly.";

                // ✅ Redirect to avoid form resubmission
                return RedirectToPage("Contact");
            }

            // If model validation fails, redisplay the form with errors
            return Page();
        }
    }
}