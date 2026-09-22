import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { applicationSchema } from "@/lib/validations";
import { calculateEMI, estimateInterestRate } from "@/lib/emi";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const applications = await prisma.loanApplication.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(applications);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = applicationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const interestRate = estimateInterestRate({
      employmentType: data.employmentType,
      monthlyIncome: data.monthlyIncome,
      yearsEmployed: data.yearsEmployed,
      loanAmount: data.loanAmount,
      loanTermMonths: data.loanTermMonths,
    });
    const monthlyPayment = calculateEMI(data.loanAmount, interestRate, data.loanTermMonths);

    const application = await prisma.loanApplication.create({
      data: {
        userId: session.user.id,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        dateOfBirth: new Date(data.dateOfBirth),
        address: data.address,
        employmentType: data.employmentType,
        employerName: data.employerName,
        monthlyIncome: data.monthlyIncome,
        yearsEmployed: data.yearsEmployed,
        loanAmount: data.loanAmount,
        loanPurpose: data.loanPurpose,
        loanTermMonths: data.loanTermMonths,
        interestRate,
        monthlyPayment,
        status: "PENDING",
      },
    });

    return NextResponse.json(application, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
