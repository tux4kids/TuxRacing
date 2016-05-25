All lesson files must follow this format:

file extension: .yaml
file contents:

    info:
      title: Lesson Title
      id: Unique Lesson Identifier (short, preferably alphanumeric)
      relativeOrder: number, relative presentation order to other lessons

    problems:
      - question: Question prompt
        choices:
         - First choice (*must* be correct choice; order will be randomized by game)
         - Second choice (wrong)
         - Third choice (wrong)
         - ... so on (arbitrary number of wrong choices >= 1)

      - question: Second question prompt
        choices:
         - First choice (correct)
         - second choice (wrong)
         - ...
      - ... and so on (arbitrary number of