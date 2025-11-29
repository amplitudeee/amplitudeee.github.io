import re

file_path = r'c:\Users\matti\Dropbox\DOCUMENTS\DCCPAA\SEMESTER 2\5. WEB DEVELOPMENT\amplitudeee.github.io\TESTS\SYSDEVTEST.html'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Find sourceA section
sourceA_start = content.find('<script type="text/plain" id="sourceA">')
sourceA_end = content.find('</script>', sourceA_start)
before_sourceA = content[:sourceA_start]
after_sourceA_marker = content.find('</script>', sourceA_end)
between = content[sourceA_end:after_sourceA_marker]

# Find sourceB section
sourceB_start = content.find('<script type="text/plain" id="sourceB">', after_sourceA_marker)
sourceB_end = content.find('</script>', sourceB_start)
before_sourceB = content[after_sourceA_marker:sourceB_start]
after_sourceB = content[sourceB_end:]

sourceA_content = content[sourceA_start:sourceA_end]
sourceB_content = content[sourceB_start:sourceB_end]

def add_prefixes(source_content):
    lines = source_content.split('\n')
    new_lines = []
    q_num = 1
    
    for i, line in enumerate(lines):
        stripped = line.strip()
        
        # Keep empty lines and script tags
        if not stripped or stripped.startswith('<script'):
            new_lines.append(line)
            continue
        
        # Check if already has Q or A prefix
        if re.match(r'^[QA]\d+:', stripped):
            new_lines.append(line)
            if stripped.startswith('Q'):
                match = re.match(r'^Q(\d+):', stripped)
                if match:
                    q_num = int(match.group(1)) + 1
            continue
        
        # Check if it's a question or answer line
        if '|' in stripped:
            pipe_count = stripped.count('|')
            if pipe_count >= 2:  # Question line
                new_lines.append(f'Q{q_num}: {stripped}')
            elif pipe_count == 1:  # Answer line
                new_lines.append(f'A{q_num-1}: {stripped}')
                new_lines.append('')  # Add blank line after answer
        else:
            # No pipes - probably answer for short answer question
            # Check if previous line was a question (no Q prefix)
            if new_lines and not re.match(r'^[QA]\d+:', new_lines[-1].strip()) and new_lines[-1].strip():
                # Previous line was question without prefix
                # This is the answer
                new_lines.append(f'A{q_num-1}: {stripped}')
                new_lines.append('')
            else:
                new_lines.append(line)
    
    return '\n'.join(new_lines)

new_sourceA = add_prefixes(sourceA_content)
new_sourceB = add_prefixes(sourceB_content)

# Reconstruct file
new_content = before_sourceA + new_sourceA + between + before_sourceB + new_sourceB + after_sourceB

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print('Updated both sourceA and sourceB with Q/A prefixes')
