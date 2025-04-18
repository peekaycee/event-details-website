using System.ComponentModel.DataAnnotations;

namespace soft20181_starter.Models
{
    public class ContactForm
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Phone]
        [Display(Name = "Mobile Number")]
        public string? PhoneNumber { get; set; }

        [Required]
        [StringLength(1000)]
        public string Message { get; set; } = string.Empty;

        [Display(Name = "Submitted At")]
        public DateTime SubmittedAt { get; set; } = DateTime.Now;
    }
}
