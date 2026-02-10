                            class Profile {
                                string Name = "Matt Salvadori";
                                string Role = "Software Dev Student";
                                string[] Skills = { "Java", "Python", "C#" };
                                string Focus => "Clean Code + OOP";
                                public void Display() =>
                                    Console.WriteLine($"{Name} — {Role} — {string.Join(" | ", Skills)} — {Focus} ");
                            }
                            class Program { static void Main() => new Profile().Display(); }



