import os

target_dir = 'nextjs_space/app'

search_str = """          } catch(e) {}
          form.innerHTML = '<div style=\\"text-align:center"""

replace_str = """          } catch(e) {}
          try {
            if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
              window.gtag('event', 'conversion', {
                'send_to': 'AW-18105187591/0oU2CLXHoKgcEIf6nLlD'
              });
            }
          } catch(e) {}
          form.innerHTML = '<div style=\\"text-align:center"""

count = 0
for root, dirs, files in os.walk(target_dir):
    for file in files:
        if file == 'page.tsx':
            filepath = os.path.join(root, file)
            with open(filepath, 'r') as f:
                content = f.read()
            if search_str in content:
                content = content.replace(search_str, replace_str)
                with open(filepath, 'w') as f:
                    f.write(content)
                count += 1

print(f"Updated {count} files.")
