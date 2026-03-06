import { NextRequest, NextResponse } from "next/server";
import { productService } from "@/lib/products";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ sku: string }> }
) {
  const { sku } = await params;

  const product = productService.getById(sku);

  if (!product) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(product);
}