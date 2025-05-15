# Board Game Builder

## Project Overview
This **Board Game Builder** is a tool that allows users to design and play custom turn-based board games. Users should at least be able to define:
- Board shape and size
- Custom pieces and their movement rules
- Tile events and special conditions
- Win conditions and turn order

This project aims to produce a **general-purpose game builder** where users define rules using a simple **"if this then that"** scripting language. Completed games are saved as **JSON files** that can be reloaded for future play. Unlike other board game builders online that provide only the graphics and physics simulations, our project will have enforceable rulesets rather than relying on the honor system.

---

## Team
- **Aaron Cook** - Project Lead
- **Sophia Culver** 
- **Landon Dennis**
- **Jackson Fixsen**

---

## MVP Goals
- Build a working interface for creating and playing **chess/checkers-like games**  
- Basic rule scripting (piece movement, captures, simple win conditions)  
- Ability to save and load games via text/JSON file  
- Functional turn management system  

---

## Technology Stack
| Component             | Technology    |
|------------------|-----------------|
| Frontend UI            | HTML/CSS/JavaScript |
| Game Logic              | JavaScript |
| Save Files                  | JSON |
| Optional LAN Hosting | Node.js + WebSockets (stretch goal) |

---

## Planned Features
### Critical (MVP)
- Board configurations (square/hex board and varying sizes)
- Turn management and action validation
- Piece movement rules
- Tile events (land on this = trigger event)
- Win conditions
- Saving/loading games

### Expected (If Time Allows)
- Piece sprite selection
- Advanced win conditions (score-based, objectives)
- Custom player inventories/resources

### Bonus (Stretch Goals)
- LAN multiplayer (host/join)
- Battleship-like hidden information mechanics
- Expanded board types (triangular grid, etc.)

---

## Expected Users
| User Type   | Role |
|------------|-----|
| Game Creator | Uses UI to design a new game and save to a JSON file |
| Game Player   | Loads a saved game file and plays it |

---

## User Stories
### Game Creator
1. Open Board Game Builder.
2. Select "Create Game."
3. Choose board shape and size.
4. Create pieces and define movement rules.
5. Configure tile events (traps, bonuses, etc.).
6. Set win conditions.
7. Save to file (download JSON).

### Game Player
1. Open Board Game Builder.
2. Select "Load Game."
3. Upload saved game file.
4. Play game according to pre-defined rules.
5. Game ends when win condition met.

---

## Object Model
[Current Brainstorming](https://docs.google.com/document/d/1-1izVs0yKSRtuq6YvPsrVxVmYLXrWrvI3HUmI4mARgA/edit?usp=sharing)

---

## Example Save File Format

## Example Save File (Preview)

This would be exported when saving a new game or an in-progress game:

```json
{
    "initialState": {
        "board": {
            "shape": "square",
            "tiles": [
                [{"type": "grass"}, {"type": "trap"}],
                [{"type": "grass"}, {"type": "goal"}]
            ]
        },
        "pieces": [
            {
                "id": 1,
                "type": "knight",
                "position": {"x": 0, "y": 0},
                "owner": 0,
                "publicVariables": {"health": 3}
            }
        ],
        "currentPlayer": 0,
        "turnStage": "movement",
        "playerInventories": [
            {"score": 0, "hand": []},
            {"score": 0, "hand": []}
        ]
    },
    "tileTypes": [
        {
            "id": "grass",
            "name": "Grass",
            "color": "white",
            "sprite": "grass.png",
            "publicVariables": [],
            "publicFunctions": [],
            "scriptingRules": [],
            "buttons": []
        },


TO BE CONTINUED
```


## Scripting Language Design
### Example Rule
- **Trigger:** Piece lands on \[TILES\]
- **Condition:** \[TILES\] is of type \[TYPES\]
- **Action:** Set \[RESOURCE\] to \[VALUE\]

Rules are designed to be:
- Simple "IF this THEN that"
- Attached to pieces, tiles, or global game events
- Stored directly in save files
- More complicated rules may require users to be able to reference specific objects and their relationships.
- Example 1: a \[TILES\] may look like thisPiece>currentTile>adjacentTiles
- Example 2: a \[VALUE\] may look like resourceA>currentValue * 2

---

## UI Sketches / Wireframe Descriptions
- **Main Menu:** Create or Play game.
- **Create Menu:** Load or New game.
- **Board Setup:** Grid preview + size/type selection. After the board is made, the main creation screen should be available.
- **Primary Creation Screen:** Center: board, Left bar: (undo, redo, zoom, move), Top Right: save as, preview, edit elements, Moveable: Any opened menus.
- **Elements Editor:** Menu for users to add or remove elements to their game and open or hide editing menus.
- **Element Menu:** Name, sprite, color, text, classes, etc. Edit/Add Rules will bring up the rule editor.
- **Rule Editor:** Dropdown-based scripting interface (choose triggers/conditions/actions). Maybe select pieces instead of searching the way Excel allows.
- **Play Menu:** Load or New game. (if we add the ability to save games in progress)
- **Game Screen:** Displays board, pieces, turn tracker, player resources, and any interactive features.

---

## Risks & Mitigations
| Risk                                    | Mitigation |
|--------------------------------|------------|
| Scripting complexity        | Prototype early & simplify scope |
| UI/UX overload                 | Focus on function before polish |
| Scope creep                      | Lock MVP features early |
| Team bandwidth            | Weekly check-ins, clear roles |

---

## Development Phases
| Phase | Description |
|--|--|
| Design Phase | Framework, class diagrams, feature/rule list |
| Frontend with Stubs | Initial UI screens with placeholders/dummy functions and class structures for actual gameplay rule implementations |
| Backend Continued | Implementing scripting for board, pieces, rules, and turns. Implementing save file creation. |
| Merge and Finish | Connect UI to real logic |
| Testing | Create example games & try to break them |

---

## Testing Plan
| Test Type      | Examples |
|------------|------------|
| Unit Testing | Move validation, event triggers |
| Full Testing | Full turn cycle across players |
| User Testing | Have non-devs create & play games |
| Milestone Check | Test all milestone games (chess, tic-tac-toe, etc.) |

---

## Example Milestone Games
- Chess/Checkers (core MVP)  
- Tic-Tac-Toe  
- Connect Four  
- Battleship (if time allows)  
- Qwirkle (if time allows)  

---

## Gantt Chart Process
[Gantt Chart Spreadsheet](https://docs.google.com/spreadsheets/d/11C-1REakt8p-5qnN5HMOjeXWOUPisdPBA-Qkgr4_KGo/edit?usp=sharing)

---

## Success Metrics
- Fully playable chess variant
- Non-developers can create & play simple games
- Saves & loads work without corruption
- Rule scripting is robust enough to handle common rule types (movement, captures, tile events)

---

## Future Features (Post MVP Features)
- LAN multiplayer
- More Intuitive Sprite creation UI (Paint Bucket Tool, More Graphical Options)
- Board zooming/panning
- Score tracking
- More advanced win conditions
- "Tile ownership" for Monopoly-like games
- More visual polish & animations

---

## Out of Scope
- Real-time play (live events)
- Custom asset uploads (stick to built-in sprites)
- Any long-term server storage/databases

---

## License
MIT - Free for anyone to use, modify, or fork.

---

## Credits
This project was created by:
- **Aaron Cook**
- **Sophia Culver**
- **Landon Dennis**
- **Jackson Fixsen**

---

## Contact
If you have any questions, please contact a team member via their Clarkson email addresses.
