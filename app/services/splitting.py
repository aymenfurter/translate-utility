import re
from typing import List, Dict

def split_markdown_into_chapters(md_content: str) -> List[Dict]:
    """
    Split markdown into chapters by any level headers (# through ######).
    Each chapter includes the header and subsequent content until the next header of any level.
    """
    lines = md_content.split('\n')
    chapters = []
    current_chapter_lines = []
    current_title = None
    current_level = 1  # Default level
    chapter_id = 0

    header_pattern = re.compile(r'^(#{1,6})\s(.+)$')

    # Handle text before first header
    for line in lines:
        header_match = header_pattern.match(line)
        if header_match:
            # Found a header of any level
            if current_chapter_lines:
                chapters.append({
                    "id": f"chapter-{chapter_id}",
                    "title": current_title if current_title else "Untitled",
                    "level": current_level,
                    "markdown": "\n".join(current_chapter_lines).strip()
                })
                chapter_id += 1
            
            current_level = len(header_match.group(1))  # Count the #'s
            current_title = header_match.group(2).strip()
            current_chapter_lines = [line]
        else:
            current_chapter_lines.append(line)

    # Don't forget the last chapter
    if current_chapter_lines:
        chapters.append({
            "id": f"chapter-{chapter_id}",
            "title": current_title if current_title else "Untitled",
            "level": current_level,
            "markdown": "\n".join(current_chapter_lines).strip()
        })

    # If no chapters were created, create one with the entire content
    if not chapters:
        chapters.append({
            "id": "chapter-0",
            "title": "Untitled",
            "level": 1,
            "markdown": md_content.strip()
        })

    return chapters
