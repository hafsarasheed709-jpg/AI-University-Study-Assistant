import { UniversityDocument } from './types.ts';

export const INITIAL_SAMPLE_DOCUMENTS: UniversityDocument[] = [
  {
    id: 'doc-cs201',
    title: 'CS 201: Data Structures & Algorithms - Complexity & Graph Theory',
    originalFileName: 'CS201_Algorithms_Complexity_Graph_Theory.pdf',
    fileSizeBytes: 245760,
    pageCount: 3,
    chunkCount: 6,
    uploadedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    status: 'ready',
    subject: 'Computer Science',
    chunks: [
      {
        id: 'cs201-p1-c1',
        documentId: 'doc-cs201',
        documentName: 'CS201_Algorithms_Complexity_Graph_Theory.pdf',
        pageNumber: 1,
        chunkIndex: 0,
        text: `CS 201: ASYMPTOTIC NOTATION AND COMPLEXITY ANALYSIS (Page 1)
Asymptotic notation characterizes the growth rate of algorithms as input size n approaches infinity.
1. Big-O Notation (O): Upper bound. f(n) = O(g(n)) if there exist positive constants c and n0 such that 0 <= f(n) <= c * g(n) for all n >= n0.
2. Big-Omega Notation (Ω): Lower bound. f(n) = Ω(g(n)) if there exist positive constants c and n0 such that 0 <= c * g(n) <= f(n) for all n >= n0.
3. Big-Theta Notation (Θ): Tight bound. f(n) = Θ(g(n)) if and only if f(n) = O(g(n)) and f(n) = Ω(g(n)).
Common Complexity Classes in hierarchy:
O(1) < O(log n) < O(n) < O(n log n) < O(n^2) < O(2^n) < O(n!).`
      },
      {
        id: 'cs201-p1-c2',
        documentId: 'doc-cs201',
        documentName: 'CS201_Algorithms_Complexity_Graph_Theory.pdf',
        pageNumber: 1,
        chunkIndex: 1,
        text: `MASTER THEOREM FOR DIVIDE-AND-CONQUER RECURRENCES (Page 1)
Given a recurrence of the form: T(n) = a * T(n/b) + f(n), where a >= 1, b > 1, and f(n) is asymptotically positive.
Let c_crit = log_b(a). The behavior depends on comparing f(n) to n^(c_crit):
Case 1 (Leaf-heavy): If f(n) = O(n^(log_b(a) - ε)) for some constant ε > 0, then T(n) = Θ(n^(log_b(a))).
Case 2 (Balanced): If f(n) = Θ(n^(log_b(a)) * log^k(n)) for some k >= 0, then T(n) = Θ(n^(log_b(a)) * log^(k+1)(n)).
Case 3 (Root-heavy): If f(n) = Ω(n^(log_b(a) + ε)) for some constant ε > 0, and the regularity condition holds: a * f(n/b) <= c * f(n) for some c < 1 and large n, then T(n) = Θ(f(n)).
Example: MergeSort has T(n) = 2T(n/2) + O(n). Here a=2, b=2, log_2(2) = 1. f(n) = Θ(n^1). By Case 2 with k=0, T(n) = Θ(n log n).`
      },
      {
        id: 'cs201-p2-c1',
        documentId: 'doc-cs201',
        documentName: 'CS201_Algorithms_Complexity_Graph_Theory.pdf',
        pageNumber: 2,
        chunkIndex: 2,
        text: `GRAPH REPRESENTATIONS AND TRAVERSALS (Page 2)
A graph G = (V, E) consists of vertices V and edges E.
- Adjacency Matrix: V x V 2D boolean array. Space complexity: O(V^2). Edge lookup: O(1). Best for dense graphs where |E| ~ |V|^2.
- Adjacency List: Array of |V| linked lists or vectors. Space complexity: O(V + E). Iterating neighbors of u takes O(deg(u)). Best for sparse graphs where |E| << |V|^2.
Breadth-First Search (BFS): Uses a FIFO Queue. Explores vertex layer by layer. Computes shortest path in unweighted graphs. Time complexity: O(V + E).
Depth-First Search (DFS): Uses recursion or a LIFO Stack. Discovers tree edges, back edges, forward edges, and cross edges. Useful for cycle detection, topological sorting, and strongly connected components (Kosaraju / Tarjan). Time complexity: O(V + E).`
      },
      {
        id: 'cs201-p2-c2',
        documentId: 'doc-cs201',
        documentName: 'CS201_Algorithms_Complexity_Graph_Theory.pdf',
        pageNumber: 2,
        chunkIndex: 3,
        text: `DIJKSTRA'S SHORTEST PATH ALGORITHM (Page 2)
Solves the single-source shortest path problem on weighted directed or undirected graphs with NON-NEGATIVE edge weights (w(u, v) >= 0).
Algorithm steps:
1. Initialize dist[s] = 0 and dist[v] = infinity for all v != s. Add all vertices to a Priority Queue keyed by dist[v].
2. While the Priority Queue is not empty:
   a. Extract vertex u with minimum dist[u].
   b. For each outgoing edge (u, v) with weight w(u, v):
      Relax edge: if dist[u] + w(u, v) < dist[v], update dist[v] = dist[u] + w(u, v) and update the priority queue.
Time Complexity:
- With an array / linear search: O(V^2 + E) = O(V^2).
- With a Binary Min-Heap: O((V + E) log V).
- With a Fibonacci Heap: O(E + V log V).
Failure condition: Dijkstra produces incorrect results if any edge weight is negative because once a vertex is marked visited, its distance is finalized under the greedy assumption.`
      },
      {
        id: 'cs201-p3-c1',
        documentId: 'doc-cs201',
        documentName: 'CS201_Algorithms_Complexity_Graph_Theory.pdf',
        pageNumber: 3,
        chunkIndex: 4,
        text: `BELLMAN-FORD ALGORITHM AND NEGATIVE WEIGHT CYCLES (Page 3)
Bellman-Ford solves the single-source shortest path problem on graphs with arbitrary edge weights (positive or negative).
Algorithm:
1. Initialize dist[s] = 0, all other dist[v] = infinity.
2. Relax all |E| edges repeatedly |V| - 1 times.
   In each iteration i from 1 to |V| - 1:
   For every edge (u, v) in E: if dist[u] + w(u, v) < dist[v], then dist[v] = dist[u] + w(u, v).
3. Negative cycle detection check (Iteration |V|):
   Iterate once more through all edges in E:
   If dist[u] + w(u, v) < dist[v], then the graph contains a negative-weight cycle reachable from source s.
Time Complexity: O(V * E). Space Complexity: O(V).`
      },
      {
        id: 'cs201-p3-c2',
        documentId: 'doc-cs201',
        documentName: 'CS201_Algorithms_Complexity_Graph_Theory.pdf',
        pageNumber: 3,
        chunkIndex: 5,
        text: `TOPOLOGICAL SORTING ON DIRECTED ACYCLIC GRAPHS (DAGs) (Page 3)
A topological sort of a directed graph is a linear ordering of vertices such that for every directed edge (u, v), vertex u appears before vertex v.
Precondition: The graph MUST be a Directed Acyclic Graph (DAG). If a cycle exists, no topological ordering is possible.
Two standard algorithms:
1. Kahn's Algorithm (Indegree-based BFS):
   - Compute in-degree for every vertex.
   - Enqueue all vertices with in-degree = 0.
   - While queue is not empty, dequeue u, append u to order, decrement in-degree of all neighbors v. If in-degree[v] becomes 0, enqueue v.
   - If count of visited vertices < |V|, graph has a cycle.
2. DFS Post-Order Reversal:
   - Run DFS. When a vertex finishes exploration (all descendants visited), push it onto a stack or prepend to list.
   - Reverse post-order yields topological sort.
Time Complexity for both: O(V + E).`
      }
    ]
  },
  {
    id: 'doc-math240',
    title: 'MATH 240: Linear Algebra & Multivariable Calculus - Spectral Theory & Optimization',
    originalFileName: 'MATH240_Linear_Algebra_Calculus_Optimization.pdf',
    fileSizeBytes: 312400,
    pageCount: 3,
    chunkCount: 6,
    uploadedAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    status: 'ready',
    subject: 'Mathematics',
    chunks: [
      {
        id: 'math240-p1-c1',
        documentId: 'doc-math240',
        documentName: 'MATH240_Linear_Algebra_Calculus_Optimization.pdf',
        pageNumber: 1,
        chunkIndex: 0,
        text: `EIGENVALUES AND EIGENVECTORS DEFINITION (Page 1)
Let A be an n x n square matrix over the real numbers R or complex numbers C.
A non-zero vector v != 0 is called an eigenvector of A corresponding to eigenvalue λ if:
A * v = λ * v, or equivalently: (A - λ * I) * v = 0.
Characteristic Equation:
For non-trivial solutions v != 0 to exist, the matrix (A - λ * I) must be singular:
det(A - λ * I) = 0.
This polynomial p(λ) = det(A - λ * I) is of degree n and is called the characteristic polynomial.
- Algebraic Multiplicity of λ: The multiplicity of λ as a root of p(λ).
- Geometric Multiplicity of λ: The dimension of the eigenspace E_λ = null(A - λ * I).
Theorem: Geometric Multiplicity <= Algebraic Multiplicity for every eigenvalue λ. A matrix is diagonalizable if and only if geometric multiplicity equals algebraic multiplicity for all eigenvalues.`
      },
      {
        id: 'math240-p1-c2',
        documentId: 'doc-math240',
        documentName: 'MATH240_Linear_Algebra_Calculus_Optimization.pdf',
        pageNumber: 1,
        chunkIndex: 1,
        text: `EIGENVALUE CALCULATION WORKED STEP-BY-STEP EXAMPLE (Page 1)
Find eigenvalues and eigenvectors for matrix A = [[4, 2], [1, 3]].
Step 1: Form the characteristic matrix (A - λ * I):
A - λ * I = [[4 - λ, 2], [1, 3 - λ]].
Step 2: Compute determinant:
det(A - λ * I) = (4 - λ)(3 - λ) - (2)(1) = 12 - 7λ + λ^2 - 2 = λ^2 - 7λ + 10.
Step 3: Solve λ^2 - 7λ + 10 = 0:
Factoring: (λ - 5)(λ - 2) = 0 => λ1 = 5, λ2 = 2.
Step 4: Find eigenvector for λ1 = 5:
(A - 5I)v = [[-1, 2], [1, -2]] [x, y]^T = [0, 0]^T.
Equation: -x + 2y = 0 => x = 2y. Eigenvector v1 = [2, 1]^T.
Step 5: Find eigenvector for λ2 = 2:
(A - 2I)v = [[2, 2], [1, 1]] [x, y]^T = [0, 0]^T.
Equation: x + y = 0 => x = -y. Eigenvector v2 = [-1, 1]^T.`
      },
      {
        id: 'math240-p2-c1',
        documentId: 'doc-math240',
        documentName: 'MATH240_Linear_Algebra_Calculus_Optimization.pdf',
        pageNumber: 2,
        chunkIndex: 2,
        text: `THE SPECTRAL THEOREM FOR SYMMETRIC MATRICES (Page 2)
Let A be an n x n real symmetric matrix (A^T = A).
Key Properties guaranteed by the Spectral Theorem:
1. All eigenvalues of A are real numbers (no complex roots with non-zero imaginary parts).
2. Eigenvectors corresponding to distinct eigenvalues are mutually orthogonal: if λ_i != λ_j, then v_i · v_j = 0.
3. There exists an orthonormal basis of R^n consisting of eigenvectors of A.
Spectral Decomposition:
A = Q * Λ * Q^T, where:
- Q is an orthogonal matrix whose columns are orthonormal eigenvectors (Q^T * Q = I).
- Λ is a diagonal matrix containing the real eigenvalues: diag(λ1, λ2, ..., λn).
As a sum of rank-1 projection matrices: A = ∑_{i=1}^n λ_i * (q_i * q_i^T).`
      },
      {
        id: 'math240-p2-c2',
        documentId: 'doc-math240',
        documentName: 'MATH240_Linear_Algebra_Calculus_Optimization.pdf',
        pageNumber: 2,
        chunkIndex: 3,
        text: `POSITIVE DEFINITE MATRICES AND QUADRATIC FORMS (Page 2)
A symmetric matrix A is Positive Definite (denoted A > 0) if for all non-zero vectors x != 0:
x^T * A * x > 0.
Equivalent Characterizations:
1. All eigenvalues of A are strictly positive: λ_i > 0 for all i = 1, ..., n.
2. All leading principal minors are strictly positive (Sylvester's Criterion).
3. A possesses a unique Cholesky Decomposition A = L * L^T where L is lower triangular with positive diagonal entries.
Positive Semi-Definite (A >= 0): x^T * A * x >= 0 for all x, which occurs if and only if all λ_i >= 0.
Applications: Curvature in multivariable optimization, covariance matrices in statistics, energy functionals in physics.`
      },
      {
        id: 'math240-p3-c1',
        documentId: 'doc-math240',
        documentName: 'MATH240_Linear_Algebra_Calculus_Optimization.pdf',
        pageNumber: 3,
        chunkIndex: 4,
        text: `MULTIVARIABLE CALCULUS: GRADIENT AND HESSIAN MATRIX (Page 3)
For a scalar field f(x_1, x_2, ..., x_n): R^n -> R:
1. Gradient Vector ∇f(x): The vector of first-order partial derivatives:
   ∇f(x) = [∂f/∂x_1, ∂f/∂x_2, ..., ∂f/∂x_n]^T.
   Geometric meaning: Points in the direction of steepest ascent of f. Magnitude ||∇f(x)|| gives the maximum rate of increase.
2. Hessian Matrix H(x): The n x n matrix of second-order partial derivatives:
   H_{i,j} = ∂^2 f / (∂x_i ∂x_j).
   By Clairaut's Theorem (Schwarz's Theorem), if second derivatives are continuous, H is symmetric: H^T = H.
Second Derivative Test for Critical Points where ∇f(x*) = 0:
- If H(x*) is positive definite (all eigenvalues > 0), x* is a strict local minimum.
- If H(x*) is negative definite (all eigenvalues < 0), x* is a strict local maximum.
- If H(x*) has both positive and negative eigenvalues, x* is a saddle point.`
      },
      {
        id: 'math240-p3-c2',
        documentId: 'doc-math240',
        documentName: 'MATH240_Linear_Algebra_Calculus_Optimization.pdf',
        pageNumber: 3,
        chunkIndex: 5,
        text: `GRADIENT DESCENT OPTIMIZATION AND CONVERGENCE (Page 3)
Gradient descent is an iterative optimization algorithm to find a local minimum of a differentiable function f(x).
Update Rule:
x_{k+1} = x_k - α * ∇f(x_k), where α > 0 is the step size or learning rate.
Convergence Analysis for L-Smooth and μ-Strongly Convex Functions:
- L-Smoothness: ||∇f(x) - ∇f(y)|| <= L ||x - y|| (the Hessian eigenvalues satisfy λ_max(H) <= L).
- Strong Convexity: f(y) >= f(x) + ∇f(x)^T (y - x) + (μ/2) ||y - x||^2 (λ_min(H) >= μ > 0).
Optimal step size: α* = 2 / (L + μ).
Linear convergence rate: ||x_k - x*|| <= ((L - μ) / (L + μ))^k * ||x_0 - x*||.
Condition number κ = L / μ controls the rate of convergence; when κ is large (ill-conditioned valley), standard gradient descent zig-zags severely.`
      }
    ]
  },
  {
    id: 'doc-bio110',
    title: 'BIO 110: Molecular Biology & Cellular Respiration - Energetics & Genetics',
    originalFileName: 'BIO110_Molecular_Cell_Biology_Genetics.pdf',
    fileSizeBytes: 278500,
    pageCount: 3,
    chunkCount: 6,
    uploadedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    status: 'ready',
    subject: 'Biology',
    chunks: [
      {
        id: 'bio110-p1-c1',
        documentId: 'doc-bio110',
        documentName: 'BIO110_Molecular_Cell_Biology_Genetics.pdf',
        pageNumber: 1,
        chunkIndex: 0,
        text: `CELLULAR RESPIRATION OVERVIEW AND GLYCOLYSIS (Page 1)
Overall balanced equation for aerobic respiration of glucose:
C6H12O6 + 6 O2 -> 6 CO2 + 6 H2O + ~30-32 ATP (ΔG°' = -2870 kJ/mol).
Glycolysis occurs in the CYTOSOL and does not require oxygen (anaerobic).
Two Phases of Glycolysis:
1. Energy Investment Phase (consumes 2 ATP):
   - Step 1: Glucose phosphorylated by Hexokinase to Glucose-6-phosphate (consumes 1 ATP).
   - Step 3: Fructose-6-phosphate phosphorylated by Phosphofructokinase-1 (PFK-1) to Fructose-1,6-bisphosphate (consumes 1 ATP). This is the committed, rate-limiting step regulated allosterically by ATP/AMP.
2. Energy Payoff Phase (produces 4 ATP and 2 NADH):
   - Substrate-level phosphorylation yields 4 ATP.
   - Reduction of 2 NAD+ to 2 NADH.
Net Yield of Glycolysis per glucose: 2 Pyruvate + 2 ATP (net) + 2 NADH.`
      },
      {
        id: 'bio110-p1-c2',
        documentId: 'doc-bio110',
        documentName: 'BIO110_Molecular_Cell_Biology_Genetics.pdf',
        pageNumber: 1,
        chunkIndex: 1,
        text: `ANAEROBIC FERMENTATION AND PYRUVATE OXIDATION (Page 1)
In the absence of oxygen, NADH cannot be re-oxidized by the mitochondrial electron transport chain. Glycolysis would halt due to depletion of NAD+. Fermentation regenerates NAD+ in the cytosol:
- Lactic Acid Fermentation (mammalian skeletal muscle): Pyruvate is reduced to Lactate by Lactate Dehydrogenase; NADH is oxidized back to NAD+.
- Alcohol Fermentation (yeast): Pyruvate is decarboxylated by Pyruvate Decarboxylase to Acetaldehyde (releasing CO2), which is reduced to Ethanol by Alcohol Dehydrogenase, regenerating NAD+.
Pyruvate Oxidation (Transition Step in Mitochondrial Matrix):
Pyruvate (3C) enters mitochondrial matrix through mitochondrial pyruvate carrier. Pyruvate Dehydrogenase Complex (PDC) catalyzes oxidative decarboxylation:
Pyruvate + CoA + NAD+ -> Acetyl-CoA (2C) + CO2 + NADH + H+.`
      },
      {
        id: 'bio110-p2-c1',
        documentId: 'doc-bio110',
        documentName: 'BIO110_Molecular_Cell_Biology_Genetics.pdf',
        pageNumber: 2,
        chunkIndex: 2,
        text: `CITRIC ACID CYCLE (KREBS CYCLE) IN MITOCHONDRIA (Page 2)
Location: Mitochondrial Matrix.
Acetyl-CoA (2 carbons) condenses with Oxaloacetate (4 carbons) via Citrate Synthase to form Citrate (6 carbons).
Cycle Stoichiometry per Acetyl-CoA:
- 2 CO2 released.
- 3 NADH produced (by Isocitrate dehydrogenase, α-Ketoglutarate dehydrogenase, and Malate dehydrogenase).
- 1 FADH2 produced (by Succinate dehydrogenase, which is Complex II of the ETC).
- 1 GTP (or ATP) via substrate-level phosphorylation (by Succinyl-CoA synthetase).
Because 1 glucose yields 2 Acetyl-CoA, the Krebs cycle turns TWICE per glucose molecule, yielding: 4 CO2, 6 NADH, 2 FADH2, and 2 ATP/GTP.`
      },
      {
        id: 'bio110-p2-c2',
        documentId: 'doc-bio110',
        documentName: 'BIO110_Molecular_Cell_Biology_Genetics.pdf',
        pageNumber: 2,
        chunkIndex: 3,
        text: `OXIDATIVE PHOSPHORYLATION AND THE ELECTRON TRANSPORT CHAIN (Page 2)
Location: Inner Mitochondrial Membrane (cristae).
Electron carriers pass electrons along increasing reduction potentials:
- Complex I (NADH:ubiquinone oxidoreductase): Receives 2e- from NADH, pumps 4 H+ into intermembrane space.
- Complex II (Succinate dehydrogenase): Receives electrons from FADH2; does NOT pump protons.
- Ubiquinone (Coenzyme Q): Lipophilic mobile carrier shuttling electrons from I & II to III.
- Complex III (Cytochrome bc1 complex / Q-cycle): Pumps 4 H+ into intermembrane space.
- Cytochrome c: Water-soluble peripheral protein shuttling electrons from III to IV.
- Complex IV (Cytochrome c oxidase): Transfers 4 electrons to final electron acceptor molecular O2, reducing it to 2 H2O. Pumps 2 H+ per pair of electrons.
Total proton pumping: ~10 H+ per NADH, ~6 H+ per FADH2.`
      },
      {
        id: 'bio110-p3-c1',
        documentId: 'doc-bio110',
        documentName: 'BIO110_Molecular_Cell_Biology_Genetics.pdf',
        pageNumber: 3,
        chunkIndex: 4,
        text: `CHEMIOSMOSIS AND ATP SYNTHASE ROTARY MECHANISM (Page 3)
Peter Mitchell's Chemiosmotic Hypothesis:
The ETC creates a Proton-Motive Force (PMF) across the inner mitochondrial membrane composed of:
1. Electrical gradient (ΔΨ, inside negative ~ -150 to -180 mV).
2. Chemical concentration gradient (ΔpH, intermembrane space more acidic by ~0.75-1.0 pH unit).
ATP Synthase (Complex V) Structure:
- F0 domain: Embedded in membrane; consists of a subunit (dual half-channels) and c-ring (rotor of 8-10 c-subunits in humans). Protons enter cytosolic half-channel, protonate Aspartate/Glutamate residue, rotate through membrane, and exit into matrix.
- F1 domain: Extends into matrix; catalytic head composed of (αβ)3 hexamer connected by central stalk (γ and ε).
Binding Change Mechanism (Paul Boyer):
As γ-stalk rotates 360°, each of the 3 β-subunits cycles through three conformations:
1. Open (O): Very low affinity for nucleotides; newly synthesized ATP released; ADP and Pi bind.
2. Loose (L): Traps ADP and Pi in place without reaction.
3. Tight (T): Drives catalytic phosphorylation of ADP + Pi into ATP.
Yield: One full 360° rotation yields 3 ATP.`
      },
      {
        id: 'bio110-p3-c2',
        documentId: 'doc-bio110',
        documentName: 'BIO110_Molecular_Cell_Biology_Genetics.pdf',
        pageNumber: 3,
        chunkIndex: 5,
        text: `DNA REPLICATION FORK AND POLYMERASE PROOFREADING (Page 3)
DNA replication is semiconservative and bidirectional from replication origins.
Key Enzymes at the Replication Fork:
- DNA Helicase (DnaB): Unwinds double helix by breaking hydrogen bonds.
- Single-Stranded DNA-Binding Proteins (SSBs): Prevent re-annealing and hairpin formation.
- DNA Primase: Synthesizes short RNA primers (~10-12 nucleotides) complementary to DNA template.
- DNA Polymerase III (E. coli holoenzyme): Main replicative enzyme. Synthesizes DNA exclusively in the 5' -> 3' direction. Possesses intrinsic 3' -> 5' exonuclease proofreading activity that excises mispaired nucleotides immediately with error rate ~10^-7.
- DNA Polymerase I: Removes RNA primers via 5' -> 3' exonuclease activity (nick translation) and fills gaps with DNA via 5' -> 3' polymerase activity.
- DNA Ligase: Catalyzes phosphodiester bond formation between adjacent 3'-OH and 5'-phosphate on the lagging strand (Okazaki fragments).`
      }
    ]
  }
];
