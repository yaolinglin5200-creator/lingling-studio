#!/usr/bin/env python3
"""Remove neighboring-cell bleed from a transparent 4x4 spritesheet."""

from __future__ import annotations

import argparse
from collections import deque
from pathlib import Path

from PIL import Image


def components(mask: list[list[bool]]) -> list[list[tuple[int, int]]]:
    height = len(mask)
    width = len(mask[0])
    seen = [[False] * width for _ in range(height)]
    found: list[list[tuple[int, int]]] = []

    for y in range(height):
        for x in range(width):
            if not mask[y][x] or seen[y][x]:
                continue
            queue = deque([(x, y)])
            seen[y][x] = True
            component: list[tuple[int, int]] = []
            while queue:
                px, py = queue.popleft()
                component.append((px, py))
                for ny in range(max(0, py - 1), min(height, py + 2)):
                    for nx in range(max(0, px - 1), min(width, px + 2)):
                        if mask[ny][nx] and not seen[ny][nx]:
                            seen[ny][nx] = True
                            queue.append((nx, ny))
            found.append(component)
    return found


def clean_cell(cell: Image.Image) -> Image.Image:
    alpha = cell.getchannel("A")
    width, height = cell.size
    pixels = alpha.load()
    mask = [[pixels[x, y] > 8 for x in range(width)] for y in range(height)]
    groups = components(mask)
    if not groups:
        return cell

    largest = max(groups, key=len)
    keep = set(largest)
    edge_band = int(height * 0.16)

    for group in groups:
        if group is largest:
            continue
        ys = [point[1] for point in group]
        near_edge = max(ys) < edge_band or min(ys) >= height - edge_band
        if not near_edge or len(group) >= len(largest) * 0.18:
            keep.update(group)

    cleaned_alpha = Image.new("L", cell.size, 0)
    cleaned_pixels = cleaned_alpha.load()
    for x, y in keep:
        cleaned_pixels[x, y] = pixels[x, y]

    cleaned = cell.copy()
    cleaned.putalpha(cleaned_alpha)
    return cleaned


def clean_sheet(source: Path, destination: Path) -> None:
    image = Image.open(source).convert("RGBA")
    width = width4 = image.width - image.width % 4
    height = height4 = image.height - image.height % 4
    image = image.crop((0, 0, width4, height4))
    cell_width = width // 4
    cell_height = height // 4
    output = Image.new("RGBA", image.size, (0, 0, 0, 0))

    for row in range(4):
        for column in range(4):
            box = (
                column * cell_width,
                row * cell_height,
                (column + 1) * cell_width,
                (row + 1) * cell_height,
            )
            output.alpha_composite(clean_cell(image.crop(box)), box[:2])

    output.save(destination, optimize=True)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path)
    parser.add_argument("destination", type=Path)
    args = parser.parse_args()
    clean_sheet(args.source, args.destination)


if __name__ == "__main__":
    main()
